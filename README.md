# Nuxt 3 Mono Repo for Group 6 Digital

## Components

### `<Form  />`

> Required Props

- **name**: string only
- **fields**: Array of <Input  /> field refs.

> Available Slot Props

- **valid**: boolean - uses provided fields props to show reactive valid/not valid status on form.
- **dirty**

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
        v-slot={ valid }
    >
    <Input
        label="Field Label Text"
        name="[field_name]"
        type="[input_type]"
        v-model="[field_name]"
        ref="[field_name]Field"
    />
    <button
        @click=login(valid)
    />
    </Form>
</template>
<script>
    const [field_name] = ref("")
    const [field_name]Field = ref(null)
    function login(valid) {
        // valid must be passed from within <Form  />
    }
</script>
```