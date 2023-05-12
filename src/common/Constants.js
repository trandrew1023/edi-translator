export const FORM_SAVE_RESPONSE = {
  SUCCESS: 0,
  FAILURE: 1,
  EXISTS: 2,
};

/**
 * EDI Translator form constants.
 * @param {string} display The display identifying the form.
 * @param {string} value The unique identifier of the form.
 */
export const FORMS = {
  DEFAULT: {
    display: "Select form",
    value: "0",
  },
  855004010: {
    display: "855 (v004010)",
    value: "855004010",
  },
  856004010: {
    display: "856 (v004010)",
    value: "856004010",
  },
};

/**
 * The list of forms to select from.
 */
export const ediTranslatorForms = [
  FORMS.DEFAULT,
  FORMS[855004010],
  FORMS[856004010],
];
