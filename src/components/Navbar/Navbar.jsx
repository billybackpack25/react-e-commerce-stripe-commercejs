import React from 'react'
import { AppBar, Toolbar, IconButton, Badge, Typography } from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons'
import { Link, useLocation } from 'react-router-dom';

import logo from '../../assets/online-shopping.png'
import useStyles from './styles';

const Navbar = ({ totalItems }) => {
    const classes = useStyles();
    const location = useLocation();

    return (
        <>
            <AppBar position='fixed' className={classes.appBar} color='inherit'>
                <Toolbar>
                    {/* Left side of NavBar  */}
                    <Typography component={Link} to='/' variant='h6' className={classes.title} color='inherit'>
                        <img src={logo} alt='Commerce.js' height='25px' className={classes.image} />
                            BillyBackPack25
                    </Typography>
                    {/* Middle of the NavBar */}
                    <div className={classes.grow} />
                    {/* Right */}
                    { 
                        location.pathname === '/' ? (
                            <div className={classes.button} >
                                <IconButton component={Link} to='/cart' aria-label='Show cart items' color='inherit'>
                                    {/* Little red number above the icon */}
                                    <Badge badgeContent={totalItems} color='secondary'>
                                        {/* Icon goes within the badge */}
                                        <ShoppingCart />
                                    </Badge>

                                </IconButton>
                            </div>
                        ) : null
                    }
                </Toolbar>
            </AppBar>
        </>
    )
}

export default Navbar
