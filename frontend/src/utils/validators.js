export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateComplaint = (complaint) => {
  const errors = {};
  
  if (!complaint.title?.trim()) {
    errors.title = 'Title is required';
  }
  
  if (!complaint.description?.trim()) {
    errors.description = 'Description is required';
  }
  
  if (!complaint.department?.trim()) {
    errors.department = 'Department is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};