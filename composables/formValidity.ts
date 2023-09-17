const validityState = ref(new Map());


/**
 * State management for all <Forms validity
 * @returns global form validity
 */
  function getValidity() {
    return validityState
  }

  /**
 * State management for all <Forms validity
 * @param formElementId string ID of <Form name=?>
 * @param name name of field 
 * @param validity boolean of HTML validity
 * @returns NOTHING
 */
  function setValidity(formElementId: string, name: string, validity: boolean) {

  if(!formElementId || !name || validity === undefined) return
  let formFieldValues = validityState.value.get(formElementId) || new Set()
  if(validity) {
    // field is valid, remove from map
    if(!validityState.value.has(formElementId)) return // Includes either no forms or excludes listed field name, return
    else {
      // assuming field name is found in previous check, remove from set and reset map.
      formFieldValues.delete(name)
      if(formFieldValues.size > 0) validityState.value.set(formElementId,formFieldValues)
      else validityState.value.delete(formElementId)
      
    }
  } else {
    // assuming validity is not valid ,add to map
      // form is not listed on map, add form field as array
      formFieldValues.add(name)
      validityState.value.set(formElementId, formFieldValues) 
    // Else would assume the field name is listed in array, do nothing.
  }
  return
  }

  /**
 * REMOVES FORM FROM State management for all <Forms validity
 * @param formElementId string ID of <Form name=?>
 * @returns NOTHING
 */
  function removeformValidity(formElementId: string) {
    validityState.value.delete(formElementId)
  }


export { getValidity, setValidity, removeformValidity }