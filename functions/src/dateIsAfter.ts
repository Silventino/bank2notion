const dateIsAfter = (date1: string, date2: string) => {
  if (!date1 || !date2) return false;
  if (date1 === date2) return false;

  const date1Parts = date1.split("-");
  const date2Parts = date2.split("-");
  const date1Obj = new Date(
    parseInt(date1Parts[0]),
    parseInt(date1Parts[1]) - 1,
    parseInt(date1Parts[2])
  );
  const date2Obj = new Date(
    parseInt(date2Parts[0]),
    parseInt(date2Parts[1]) - 1,
    parseInt(date2Parts[2])
  );
  return date1Obj < date2Obj;
};

export default dateIsAfter;
