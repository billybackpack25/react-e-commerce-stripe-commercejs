import React, { useState, useEffect } from 'react'
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { commerce } from '../../lib/commerce';

import FormInput from './CustomTextField';

const AddressForm = ({ checkoutToken, next }) => {
    const [shippingCountries, setShippingCountries] = useState([]);
    const [shippingCountry, setShippingCountry] = useState('');
    const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
    const [shippingSubdivision, setShippingSubdivision] = useState('');
    const [shippingOptions, setShippingOptions] = useState([]);
    const [shippingOption, setShippingOption] = useState('');

    // Take a list of Objects and return another object with named keys.
    // So GB: United Kingdom turns into id: GB, name: United Kingdom.
    const countries = Object.entries(shippingCountries).map(([code, name]) => ({ id: code, label: name }))
    // Do the same for subdivisions
    const subdivisions = Object.entries(shippingSubdivisions).map(([code, name]) => ({ id: code, label: name }))
    // Sub Division
    const options = shippingOptions.map((sO) => ({id: sO.id, label: `${sO.description} - (${sO.price.formatted_with_symbol})`}))

    // const fetchShippingCountries = async (checkoutTokenId) => {
    //     const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId);
    //     //console.log('All countries available: ', countries);
    //     setShippingCountries(countries);
    //     setShippingCountry(Object.keys(countries)[0]);
    // }

    // const fetchSubdevisions = async (countryCode) => {
    //     const { subdivisions } = await commerce.services.localeListShippingSubdivisions(checkoutToken.id, countryCode);
    //     //console.log('All subdivisions available: ', subdivisions);
    //     setShippingSubdivisions(subdivisions);
    //     setShippingSubdivision(Object.keys(subdivisions)[0]);
    // }

    // const fetchShippingOptions = async (checkoutTokenId, country, region = null) => {
    //     const options = await commerce.checkout.getShippingOptions(checkoutTokenId, {country, region});
    //     setShippingOptions(options);
    //     setShippingOption(options[0].id);
    // }

    useEffect(() => {
        const fetchShippingCountries = async (checkoutTokenId) => {
            const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId);
            //console.log('All countries available: ', countries);
            setShippingCountries(countries);
            setShippingCountry(Object.keys(countries)[0]);
        }

        if(checkoutToken.id) fetchShippingCountries(checkoutToken.id);
    }, [checkoutToken.id])

    // When ever the shipping country changes
    useEffect(() => {
        const fetchSubdevisions = async (countryCode) => {
            const { subdivisions } = await commerce.services.localeListShippingSubdivisions(checkoutToken.id, countryCode);
            //console.log('All subdivisions available: ', subdivisions);
            setShippingSubdivisions(subdivisions);
            setShippingSubdivision(Object.keys(subdivisions)[0]);
        }

        if(shippingCountry) fetchSubdevisions(shippingCountry);
    }, [shippingCountry, checkoutToken.id])

    // When the shippingSubdivision changes get the Options for shipping
    useEffect(() => {
        const fetchShippingOptions = async (checkoutTokenId, country, region = null) => {
            const options = await commerce.checkout.getShippingOptions(checkoutTokenId, {country, region});
            setShippingOptions(options);
            setShippingOption(options[0].id);
        }
        if (shippingSubdivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision)        
    }, [shippingSubdivision, checkoutToken.id, shippingCountry])

    // Get the methods needed to run the form
    const methods = useForm();

    return (
        <>
            <Typography variant="h6" gutterBottom>Shipping Address</Typography>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit((data) => next({...data, shippingCountry, shippingSubdivision, shippingOption}))}>
                    <Grid container spacing={3}>
                        <FormInput name='firstName' label='First name' />
                        <FormInput name='lastName' label='Last name' />
                        <FormInput name='address1' label='Address' />
                        <FormInput name='email' label='Email' />
                        <FormInput name='city' label='City' />
                        <FormInput name='zip' label='Post Code' />
                        {/* Shipping Country */}
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Country</InputLabel>
                            <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>
                                {countries.map((country) => (
                                    <MenuItem key={country.id} value={country.id}>
                                        {country.label}
                                    </MenuItem> 
                                ))}
                            </Select>
                        </Grid>
                        {/* Shipping Subdivision */}
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Subdivision</InputLabel>
                            <Select value={shippingSubdivision} fullWidth onChange={(e) => setShippingSubdivision(e.target.value)}>
                                {
                                    subdivisions.map((subdivision) => (
                                    <MenuItem key={subdivision.id} value={subdivision.id}>
                                        {subdivision.label}
                                    </MenuItem>))
                                }
                            </Select>
                        </Grid>
                        {/* Shipping Options */}
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Options</InputLabel>
                            <Select value={shippingOption} fullWidth onChange={(e) => setShippingOption(e.target.value)}>
                            
                                {
                                    options.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.label}
                                    </MenuItem>))
                                }
                            </Select>
                        </Grid>
                    </Grid>
                    <br />
                    <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                            <Button component={Link} to='/cart' variant='outlined'>Back to Cart</Button>
                            <Button type='submit' variant='contained' color='primary'>Next</Button>

                    </div>
                </form>
            </FormProvider>
        </>
    )
}

export default AddressForm
