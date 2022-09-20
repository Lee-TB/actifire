import { useState, useRef, useEffect } from 'react';
import { InputNumber } from 'antd';

function InputTimes({ value, onChangeDebounce, ...props }) {
  const [state, setState] = useState(0);
  const timeoutId = useRef();

  useEffect(() => {
    setState(value);
  }, [value]);

  const handleInputChange = (number) => {
    setState(number);

    clearTimeout(timeoutId.current);

    timeoutId.current = setTimeout(() => {
      onChangeDebounce(number);
    }, 250);
  };

  return <InputNumber value={state} onChange={handleInputChange} {...props} />;
}

export default InputTimes;
