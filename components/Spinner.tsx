const Spinner = () => (
    <div className="spinner">
      {[...Array(10)].map((_, i) => (
        <div key={i}></div>
      ))}
    </div>
  );
export default Spinner;  