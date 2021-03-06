import React, { Component } from "react";

export function dropdown (data, item)  {

  const list = data.map((entry) =>
    <option
    key={entry[item].toString()}
    value = {entry[item]}>
      {entry[item]}
    </option>
  );

  console.log(list);

  return list;
}

export function dropdownDisabled (data, item)  {

  const list = data.map((entry) =>
    <option
    key={entry[item].toString()}
    value = {entry[item]}
    disabled>
      {entry[item]}
    </option>
  );

  console.log(list);

  return list;
}
