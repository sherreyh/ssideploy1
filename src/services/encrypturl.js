//cipher product id
export const crypt = (text) => {
  // convert to string and make array of characters
  var res = text.toString().split("");
  // convert to charcode
  res = res.map((c) => c.charCodeAt(0));
  // multiply with random number
  res = res.map((a) => a * 31);

  res = res.join("dxd");
  return res;
};
//decipher product id
export const decrypt = (text) => {
  var res = text.split("dxd");
  // multiply with random number
  res = res.map((a) => parseInt(a) / 31);
  // convert to charcode
  res = res.map((c) => String.fromCharCode(c));
  // convert to string and make array of characters
  res = res.join("");

  return res;
};

export const storagepath = () => "http://localhost:8000/storage/";
