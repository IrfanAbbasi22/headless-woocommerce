"use client";
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, reset } from '../store/slices/counterSlice';

const Counter = () => {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Counter: {count}</h1>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())} style={{ margin: '0 10px' }}>
        Decrement
      </button>
      <button onClick={() => dispatch(reset())}>Reset</button>
    </div>
  );
};

export default Counter;
