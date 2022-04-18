const validateImageFile = (file) => /image\/jpeg|png/.test(file.type);
export default validateImageFile;
