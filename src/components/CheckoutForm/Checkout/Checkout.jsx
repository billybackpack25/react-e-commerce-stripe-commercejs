import React, { useState, useEffect } from 'react'
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button, CssBaseline } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';

import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';

import { commerce } from '../../../lib/commerce';
import useStyles from './styles';

const steps = ['Shipping address', 'Payment details']

const Checkout = ({ cart, order, onCaptureCheckout, error }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingData] = useState({});
    const classes = useStyles();
    const history = useHistory();

    useEffect(() => {
        const generateToken = async () => {
            try {
                console.log('Cart ID: ', cart.id);
                const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' })
                setCheckoutToken(token);
            } catch (error) {
                console.log('ERROR Checkout l-26:',error);
                history.push('/');
            }
        }
        if (cart.id && cart.total_items > 0) {
            generateToken();
        }
    }, [cart]);

    const nextStep = () => setActiveStep(prev => prev + 1)
    const backStep = () => setActiveStep(prev => prev - 1)
    
    const next = (data) => {
        setShippingData(data);
        nextStep();
    }

    let Confirmation = () => order.customer ? (
        <> 
            <div>
                <Typography variant='h5'>Thank you for your purchase, {order.customer.firstname} {order.customer.lastname}</Typography>
                <Divider className={classes.divider}/>
                <Typography variant="subtitle2">Order ref: {order.customer_reference}</Typography>
            </div>
            <br />
            <Button component={Link} to='/' variant="outlined" type='button' color="default">Back to Home</Button>
        </>
    ) : (
        // If it's loading
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    );

    if(error){
        <>
            <Typography variant="h5" color="initial">Error: {error}</Typography>
            <br/>
            <Button component={Link} to='/' variant="outlined" type='button' color="default">Back to Home</Button>
        </>
    }

    
    // Address and payment forms depending on what step the user is on
    const Form = () => activeStep === 0 
        ? <AddressForm checkoutToken={checkoutToken} next={next} /> 
        : <PaymentForm 
            checkoutToken={checkoutToken} 
            shippingData={shippingData} backStep={backStep}
            onCaptureCheckout={onCaptureCheckout}
            nextStep={nextStep}
        />

    return (
        <>
            <CssBaseline />
            <div className={classes.toolbar} />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant="h4" align='center'>Checkout</Typography>
                    {/* Create a nice looking stepper */}
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((step) => (
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {/* If we're on the last step show confirmation, otherwise show form */}
                    {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form /> }
                </Paper>
            </main>
        </>
    )
}

export default Checkout
