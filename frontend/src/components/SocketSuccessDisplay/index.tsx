import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { clearLoginSuccess } from '../../features/socket/socketSlice';

const SocketSuccessDisplay = () => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state: RootState) => state.socket.loggedInUser);

  useEffect(() => {
    if (loggedInUser) {
      const timer = setTimeout(() => {
        dispatch(clearLoginSuccess());
      }, 5000); // Auto-hide after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [loggedInUser, dispatch]);

  if (!loggedInUser) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 w-auto max-w-sm p-4 border-l-4 border-[green] rounded-r-lg shadow-lg z-50 flex items-start">
      <div className="flex-shrink-0">
        <svg className="w-6 h-6 text-[green]" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm font-bold text-[green]">Success</p>
        <p className="text-sm text-[green] mt-1">Logged in as {loggedInUser}</p>
      </div>
      <button 
        onClick={() => dispatch(clearLoginSuccess())} 
        className="ml-4 -mt-1 -mr-1 p-1 rounded-full hover:bg-[green] focus:outline-none focus:ring-2 focus:ring-[green]"
      >
        <svg className="w-4 h-4 text-[green]" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default SocketSuccessDisplay;
