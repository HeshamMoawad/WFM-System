import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { clearSocketError } from '../../features/socket/socketSlice';

const SocketErrorDisplay = () => {
  const dispatch = useDispatch();
  const error = useSelector((state: RootState) => state.socket.error);

  if (!error) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 w-auto bg-[white] max-w-sm p-4 border-l-4 border-[red] rounded-r-lg shadow-lg z-50 flex items-start">
      <div className="flex-shrink-0">
        <svg className="w-6 h-6 text-[red]" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 102 0v-4zM9 13a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
        </svg>
      </div>    
      <div className="ml-3 flex-1">
        <p className="text-sm font-bold text-[red]">Error</p>
        <p className="text-sm text-[red] mt-1">{error.message}</p>
      </div>
      <button 
        onClick={() => dispatch(clearSocketError())} 
        className="ml-4 -mt-1 -mr-1 p-1 rounded-full  focus:outline-none focus:ring-2 focus:ring-[red]"
      >
        <svg className="w-4 h-4 text-[red]" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default SocketErrorDisplay;
