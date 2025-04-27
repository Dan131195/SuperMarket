import errorImg from "../assets/img/404.png";

const Error = () => {
  return (
    <div className="container text-center w-100">
      <h2 className="mt-5 mt-lg-2 mb-0 text-light display-4 fw-semibold">
        Ops, page not found..
      </h2>
      <div className="p-1 p-md-2 p-lg-3 p-xl-5">
        <img
          src={errorImg}
          alt="Page Not Found"
          className=" pt-5 pt-lg-0 errorImg"
        />
      </div>
    </div>
  );
};

export default Error;
