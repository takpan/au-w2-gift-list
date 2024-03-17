const uint8ObjectToHexString = (uint8) => {
    return Object.values(uint8).map((i) => i.toString(16).padStart(2, '0')).join('')
    }
  
export default uint8ObjectToHexString;