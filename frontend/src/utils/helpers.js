export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusVariant = (status) => {
  const variants = {
    'pending': 'warning',
    'in-progress': 'info',
    'resolved': 'success',
    'rejected': 'danger'
  };
  return variants[status] || 'secondary';
};

export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).replace('-', ' ');
};

export const truncateText = (text, length = 100) => {
  if (text.length <= length) return text;
  return text.substr(0, length) + '...';
};