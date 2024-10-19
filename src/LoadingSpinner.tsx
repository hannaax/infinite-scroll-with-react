const LoadingSpinner = () => {
  return (
    <div style={{ inset: "0", opacity: "0.9", zIndex: "50" }}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <img src="/loading.gif" alt="Loading" width="100px" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
