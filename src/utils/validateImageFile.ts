const validateImageFile = (file: File): boolean => /image\/jpeg|png/.test(file.type)
export default validateImageFile
