export const consistFormData = (object: any) =>
  Object.entries(object).reduce((fd, [k, val]) => {
    if (val) {
      if (Array.isArray(val)) {
        for (let i = 0; i < val.length; i++) {
          Object.entries(val[i]).forEach(([key, value]) => {
            value ? fd.append(k + `[${i}].` + key, value as Blob | string) : '';
          });
        }
      } else {
        fd.append(k, val as Blob | string);
      }
    }
    return fd;
  }, new FormData());
