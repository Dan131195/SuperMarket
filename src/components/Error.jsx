import errorImg from "../assets/img/404.png";

const Error = () => {
  return (
    <div className="container text-center w-100">
      <h2 className="mt-5 mt-lg-2 mb-0 text-light display-3 fw-semibold">
        Ops, page not found..
      </h2>
      <img
        src={errorImg}
        alt="Page Not Found"
        className="w-75 pt-5 pt-lg-0 errorImg"
      />
    </div>
  );
};

export default Error;
