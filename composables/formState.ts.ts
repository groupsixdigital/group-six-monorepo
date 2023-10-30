/**
 * Set local storage to maintain form field state for a short period of time.
 * @param formElementId ID name of form
 * @param name name of field
 * @param value value of field.
 */
async function setFormState(
  formElementId: string,
  name: string,
  value: string
) {
  // update locally stored form state when each field is updated and update expiration to 24 hours.
  const currentStorage =
    (await JSON.parse(sessionStorage.getItem(formElementId))) || {};
  if (value.length) currentStorage[name] = value;
  else {
    if (currentStorage[name]) delete currentStorage[name];
  }
  if (Object.keys(currentStorage).length)
    sessionStorage.setItem(formElementId, JSON.stringify(currentStorage));
  else clearFormState(formElementId);
}

function clearFormState(formElementId: string) {
  sessionStorage.removeItem(formElementId);
}

async function getFormState(formElementId: string) {
  // grab local form state on form component load only
  return await JSON.parse(sessionStorage.getItem(formElementId));
}
