import React from 'react'
import { TextField, Grid } from '@material-ui/core';
import { useFormContext, Controller } from 'react-hook-form';

const FormInput = ({name, label }) => {
    const { control } = useFormContext;
    return (
        <Grid item xs={12} sm={6}>
            <Controller 
                control={control}
                //fullWidth
                name={name}
                defaultValue=''
                //rules={{ required: true }}
                render={({
                    field: { onChange, onBlur, value, name, ref },
                    fieldState: { invalid, isTouched, isDirty, error },
                    formState,
                }) => (
                    <TextField
                        onChange={onChange}
                        inputRef={ref}
                        label={label}
                        fullWidth
                        required
                    />
                )}
            />
        </Grid>
    )
}

export default FormInput
