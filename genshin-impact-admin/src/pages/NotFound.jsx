import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="text-9xl font-bold text-primary mb-4">404</div>
      <h1 className="text-3xl mb-8">Halaman Tidak Ditemukan</h1>
      <p className="text-gray-600 mb-8 text-center">
        Maaf, halaman yang Anda cari tidak dapat ditemukan.
      </p>
      <Link to="/dashboard" className="btn btn-primary">
        Kembali ke Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
