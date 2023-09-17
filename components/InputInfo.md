- All inputs must be wrapped in a ```<Form></Form>``` element.
> name required on form element. This helps serialize the form element for globally and dynamically tracking validation.

> slotProps provides props from the form component. Currently: validation status.<br  />
> i.e. ```<button :disabled="!slotProps.valid"  />```

### Required Props for Input

- name > Used for serializing the input field
- type > Must be selected from a preset type
- label > Just always use a label man.
- v-model > required for data binding.

``` javascript
<Form name='nameId' v-slot="slotProps">
    <Input name="string" type="type" label="Label String" v-model="data" />
</Form>
```

### Validation

Each field monitors its own validation using a mixture of HTML with javascript. Validation will be shown based on various props on the component element.

Global form validation status will be bubbled to the closest parent ```<Form></Form>``` element.

### Sanitization

Basic client size sanitization is done with selected props on the input element (i.e. alpha)

### Alternative Types of Inputs

- textarea > use in side type prop.