/* Defining standard responses to avoid repeating the same code and make it more maintainable */
export const successResponse = ({ data, code = 200, res }) => {
  res.status(code).json({ message: data });
};

export const errorResponse = ({ err, code = 500, res }) => {
  res.status(code).json({ error: err.message });
};
