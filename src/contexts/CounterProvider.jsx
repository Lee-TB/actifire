import React, { useContext, useReducer } from 'react';

const CounterContext = React.createContext();

const initialState = {
  count: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
  }
}

function CounterProvider({ children }) {
  useReducer();
  return <CounterContext.Provider>{children}</CounterContext.Provider>;
}

function useCounterContext() {
  return useContext(CounterContext);
}

export { useCounterContext };

export default CounterProvider;
