# Nuxt 3 Mono Repo for Group 6 Digital

## Components

### `<Form  />`

> Required Props

- **name**: string only

> Available Slot Props

- **valid**: boolean - true is valid, false is invalid. Uses Validation Props to validate.
- **dirty**: boolean - true is dirty, false is untouched.
- **requiredValidity**: boolean - true is required field is fulfilled, false is required field is NOT fulfilled.

### `<Input  />`

Basic client size sanitization is done with selected props on the input element (i.e. alpha)

> Required Props

- **label**: string only
- **name**: string only
- **type**: choose from list of supported types
- **v-model**: must assign to a ref

> Optional Props

- **labelHidden**: boolean - to hide label from view (sr only)
- **placeholder**: string only
- **value**: number or string - preset values
- **disabled**: boolean
- **autocomplete**: choose from list of supported autocomplete options. See WC3
- **retype**: boolean - use for password verification. Must match password field.

> Validation Props

Each field monitors its own validation using a mixture of HTML with javascript. Validation will be shown based on various props on the component element.

- **required**: boolean
- **minlength**: number - number of characters
- **maxlength**: number - number of characters
- **max**: number - number value ceiling
- **min**: number - number value floor
- **step**: number - used for range fields
- **mid**: number - used for range fields
- **rows**: number - used for textarea size
- **alpha**: boolean - enable alpha only character validation
- **alphanumeric**: boolean - enable alphanumeric character validation

> Validation Tracking

All form validation is tracked on an global composable with reactive state management: ```formState.ts```

- **useFormState**: Reactive Map() holding forms and fields.
- **useGetFormState(form_name)**: Returns form object with all fields included.
- **useGetInputState(form_name,field_name)**: Returns field object with reactive status.
- **useCheckValidity()**: Performs validity check on input field based on provided Validation Props, and updated state.

> Available Input Types

- text
- password
- number
- range
- date
- email
- search
- url
- tel
- textarea

``` html
<template>
    <Form  
        name=""
        :fields=[]
        v-slot={ valid, requiredValidity, dirty }
    >
    <Input
        label="Field Label Text"
        name="[field_name]"
        type="[input_type]"
        v-model="[field_name]"
    />
    <button
        @click=login(valid)
    />
    </Form>
</template>
<script>
    const [field_name] = ref("") // reactive field values
    function login(valid, requiredValidity) {
        // valid must be passed from within <Form  />
    }
</script>
```