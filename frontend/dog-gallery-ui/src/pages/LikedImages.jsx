import { useEffect, useState } from "react";
import API from "../services/api";

export default function LikedImages() {
  const [likes, setLikes] = useState([]);
  const [zoomImage, setZoomImage] = useState(null);

  useEffect(() => {
    API.get("/likes").then(res => setLikes(res.data));
  }, []);

  return (
    <div className="container-fluid px-4 mt-4">
      <h2 className="fw-bold mb-4">Liked Images</h2>

      <div className="row">
        {likes.map(item => (
          <div key={item.id} className="col-6 col-md-3 mb-4">
            <div className="gallery-card">
              <img
                src={item.image_url}
                alt="liked dog"
                className="gallery-image"
                onClick={() => setZoomImage(item.image_url)}
              />
            </div>
          </div>
        ))}
      </div>

      {zoomImage && (
                <div className="zoom-overlay" onClick={() => setZoomImage(null)}>
                    <img src={zoomImage} className="zoom-image" />
                </div>
            )}

      {likes.length === 0 && (
        <p className="text-center mt-5">
          No liked images yet
        </p>
      )}
    </div>
  );
}
