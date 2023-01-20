/* eslint-disable react/jsx-key */

export default function OfferAddressSummary({ address }) {
    const constructAddress = (address) => {
      let addrArray = [];
      appendToArray(address?.city?.name, addrArray);
      appendToArray(address?.city?.region?.name, addrArray);
      appendToArray(address?.city?.region?.country?.name, addrArray);
      return addrArray.join(", ");
    };
  
    let appendToArray = (value, arr) => {
      if (typeof value != "undefined" && value != null) {
        arr.push(value);
      }
      return arr;
    };
    return <>{constructAddress(address)}</>;
  }
  