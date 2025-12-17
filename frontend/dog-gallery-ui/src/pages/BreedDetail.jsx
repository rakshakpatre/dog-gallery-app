import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Toast from "../components/Toast";

export default function BreedDetail() {
    const { name } = useParams();
    const [images, setImages] = useState([]);
    const [visibleCount, setVisibleCount] = useState(10);
    const [loading, setLoading] = useState(true);
    const [likedImages, setLikedImages] = useState([]);
    const [error, setError] = useState(null);
    const [zoomImage, setZoomImage] = useState(null);
    const [toast, setToast] = useState("");


    useEffect(() => {

        API.get("/likes").then(res => {
            setLikedImages(res.data.map(item => item.image_url));
        });

        setLoading(true);
        setError(null);

        fetch(`https://dog.ceo/api/breed/${name}/images`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to load images");
                return res.json();
            })
            .then(data => {
                setImages(data.message || []);
                setVisibleCount(10);
                setLoading(false);

                const params = new URLSearchParams(window.location.search);
                const imgIndex = params.get("img");

                if (imgIndex) {
                    setTimeout(() => {
                        const element = document.getElementById(`img-${imgIndex}`);
                        if (element) {
                            element.scrollIntoView({ behavior: "smooth" });
                        }
                    }, 300);
                }
            })
            .catch(() => {
                setError("Unable to load images. Please try again.");
                setLoading(false);
            });

        API.post("/viewed", { breed: name });

    }, [name]);

    const loadMore = () => {
        setVisibleCount(prev => prev + 10);
    };

    const toggleLike = (imgUrl) => {
        if (likedImages.includes(imgUrl)) {
            API.delete("/like", {
                params: { image_url: imgUrl }
            }).then(() => {
                setLikedImages(prev => prev.filter(url => url !== imgUrl));
                setToast("Image unliked");
            });
        } else {
            API.post("/like", {
                breed: name,
                image_url: imgUrl
            }).then(() => {
                setLikedImages(prev => [...prev, imgUrl]);
                setToast("Image liked");
            });
        }
    };

    const shareImage = (index) => {
        const shareUrl = `${window.location.origin}/breed/${name}?img=${index}`;

        if (navigator.share) {
            navigator.share({
                title: `${name} dog image`,
                url: shareUrl
            });
        } else {
            navigator.clipboard.writeText(shareUrl);
            setToast("Link copied to clipboard!");
        }
    };


    return (
        <div className="container-fluid px-4 mt-4">

            {/* Page Header */}
            <div className="mb-4">
                <h2 className="text-capitalize text-center fw-bold">{name} Dogs</h2>
                <p className="breed-subtitle text-center">
                    Browse images of the {name} breed
                </p>
            </div>

            {loading && (
                <div className="text-center mt-5">
                    <div className="spinner-border text-dark"></div>
                    <p className="mt-2">Loading images...</p>
                </div>
            )}

            {error && (
                <div className="text-center mt-5">
                    <p className="text-danger">{error}</p>
                    <button
                        className="btn btn-dark"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </button>
                </div>
            )}


            {/* Image Gallery */}
            <div className="row">
                {images.slice(0, visibleCount).map((img, index) => (
                    <div
                        key={index}
                        id={`img-${index}`}
                        className="col-6 col-md-3 mb-4"
                    >
                        <div className="gallery-card position-relative">
                            <img
                                src={img}
                                alt="dog"
                                className="gallery-image"
                                onClick={() => setZoomImage(img)}
                            />

                            {/* Like Button */}
                            <button
                                className={`like-btn ${likedImages.includes(img) ? "liked" : ""}`}
                                onClick={() => toggleLike(img)}
                            >
                                {likedImages.includes(img) ? "❤️" : "🤍"}
                            </button>

                            {/* Share Button */}
                            <button
                                className="share-btn"
                                onClick={() => shareImage(index)}
                            >
                                🔗
                            </button>
                        </div>

                    </div>
                ))}
            </div>

            {zoomImage && (
                <div className="zoom-overlay" onClick={() => setZoomImage(null)}>
                    <img src={zoomImage} className="zoom-image" />
                </div>
            )}

            {/* Load More Button */}
            {visibleCount < images.length && (
                <div className="text-center mb-5">
                    <button
                        className="btn btn-dark px-4 py-2 rounded-pill"
                        onClick={loadMore}
                    >
                        Load More
                    </button>
                </div>
            )}

            {!loading && !error && images.length === 0 && (
                <p className="text-center text-muted mt-5">
                    No images available for this breed.
                </p>
            )}

            {toast && (
                <Toast
                    message={toast}
                    show={true}
                    onClose={() => setToast("")}
                />
            )}
        </div>
    );
}

