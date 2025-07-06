import HashLoader from "react-spinners/HashLoader";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <HashLoader
        color="#10B981"
        size={80}
        speedMultiplier={1.2}
      />
    </div>
  );
};

export default LoadingSpinner;
