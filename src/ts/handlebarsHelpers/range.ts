export const range = function (
  start: number,
  end: number,
  context: any,
  options: any
) {
  let result = "";
  for (let i = start; i <= end; i++) {
    result += options.fn({ ...context, index: i });
  }
  return result;
};
