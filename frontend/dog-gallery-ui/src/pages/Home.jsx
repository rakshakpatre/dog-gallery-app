import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function Home() {
    const [recentBreeds, setRecentBreeds] = useState([]);
    const [breeds, setBreeds] = useState([]);
    const [images, setImages] = useState({});
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [sort, setSort] = useState("az");
    const [likedStats, setLikedStats] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

    const breedsPerPage = 16;

    useEffect(() => {
        fetch("https://dog.ceo/api/breeds/list/all")
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch breeds");
                return res.json();
            })
            .then(data => {
                const breedList = Object.keys(data.message);
                setBreeds(breedList);
                setLoading(false);
                breedList.forEach(breed => {
                    fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
                        .then(res => res.json())
                        .then(imgData => {
                            setImages(prev => ({
                                ...prev,
                                [breed]: imgData.message
                            }));
                        });
                });
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, filter, sort]);

    useEffect(() => {
        API.get("/viewed").then(res => {
            setRecentBreeds(res.data);
        });
    }, []);

    useEffect(() => {
        API.get("/stats/liked-breeds").then(res => {
            setLikedStats(res.data);
        });
    }, []);


    const filteredBreeds = breeds.filter(b =>
        b.toLowerCase().includes(search.toLowerCase())
    );

    let processedBreeds = [...filteredBreeds];

    if (filter === "liked") {
        const likedSet = new Set(likedStats.map(b => b.breed));
        processedBreeds = processedBreeds.filter(b => likedSet.has(b));
    }

    if (filter === "recent") {
        processedBreeds = recentBreeds;
    }

    if (sort === "az") {
        processedBreeds.sort();
    }

    if (sort === "za") {
        processedBreeds.sort().reverse();
    }

    if (sort === "likes") {
        const likeMap = {};
        likedStats.forEach(b => (likeMap[b.breed] = b.count));

        processedBreeds.sort(
            (a, b) => (likeMap[b] || 0) - (likeMap[a] || 0)
        );
    }

    const startIndex = (currentPage - 1) * breedsPerPage;
    const totalPages = Math.ceil(processedBreeds.length / breedsPerPage);
    const paginatedBreeds = processedBreeds.slice(
        startIndex,
        startIndex + breedsPerPage
    );


    return (
        <div className="container-fluid mt-4 px-4">
            <div className="row align-items-center g-2 mb-4">

                {/* Title */}
                <div className="col-5 col-md-3">
                    <h4 className="mb-0">Dog Breeds</h4>
                </div>

                {/* Search */}
                <div className="col-7 col-md-3">
                    <input
                        type="text"
                        className="form-control search-input"
                        placeholder="Search breeds..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {/* Filter */}
                <div className="col-6 col-md-3">
                    <select
                        className="form-select custom-dropdown"
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                    >
                        <option value="all">All Breeds</option>
                        <option value="liked">Liked Breeds</option>
                        <option value="recent">Recently Viewed</option>
                    </select>
                </div>

                {/* Sort */}
                <div className="col-6 col-md-3">
                    <select
                        className="form-select custom-dropdown"
                        value={sort}
                        onChange={e => setSort(e.target.value)}
                    >
                        <option value="az">A – Z</option>
                        <option value="za">Z – A</option>
                        <option value="likes">Most Liked</option>
                    </select>
                </div>

            </div>


            {/* Recently Viewed Breeds */}
            {recentBreeds.length > 0 && (
                <div className="mb-5">
                    <h5 className="fw-bold mb-3">Recently Viewed</h5>

                    <div className="recent-scroll col-12">
                        {recentBreeds.map(breed => (
                            <Link
                                key={breed}
                                to={`/breed/${breed}`}
                                className="recent-card text-decoration-none"
                            >
                                <div
                                    className="recent-image"
                                    style={{
                                        backgroundImage: `url(${images[breed]})`
                                    }}
                                >
                                    <div className="recent-overlay">
                                        <span className="text-capitalize text-white fw-bold">
                                            {breed}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {loading && (
                <div className="text-center mt-5">
                    <div className="spinner-border text-dark" role="status"></div>
                    <p className="mt-2 text-muted">Loading dog breeds...</p>
                </div>
            )}

            {error && (
                <div className="text-center mt-5">
                    <p className="text-danger fw-bold">{error}</p>
                    <button
                        className="btn btn-dark mt-2"
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Breed Cards */}
            <div className="row">
                {paginatedBreeds.map(breed => (
                    <div key={breed} className="col-6 col-md-3 mb-4">
                        <Link to={`/breed/${breed}`} className="text-decoration-none">
                            <div
                                className="breed-image-card"
                                style={{
                                    backgroundImage: `url(${images[breed]})`
                                }}
                            >
                                <div className="breed-overlay">
                                    <h4 className="breed-title text-capitalize">
                                        {breed}
                                    </h4>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {!loading && !error && paginatedBreeds.length === 0 && (
                <p className="text-center text-muted mt-5">
                    No breeds found. Try a different search.
                </p>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                // <nav className="d-flex justify-content-center mt-4">
                //     <ul className="pagination">

                //         <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                //             <button
                //                 className="page-link"
                //                 onClick={() => setCurrentPage(prev => prev - 1)}
                //             >
                //                 Previous
                //             </button>
                //         </li>

                //         {[...Array(totalPages)].map((_, i) => (
                //             <li
                //                 key={i}
                //                 className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                //             >
                //                 <button
                //                     className="page-link"
                //                     onClick={() => setCurrentPage(i + 1)}
                //                 >
                //                     {i + 1}
                //                 </button>
                //             </li>
                //         ))}

                //         <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                //             <button
                //                 className="page-link"
                //                 onClick={() => setCurrentPage(prev => prev + 1)}
                //             >
                //                 Next
                //             </button>
                //         </li>

                //     </ul>
                // </nav>

                <nav className="d-flex justify-content-center mt-4">
                    <ul className="pagination pagination-responsive">

                        {/* Previous */}
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                onClick={() => setCurrentPage(prev => prev - 1)}
                            >
                                Prev
                            </button>
                        </li>

                        {/* Page Numbers (Desktop Only) */}
                        {[...Array(totalPages)].map((_, i) => (
                            <li
                                key={i}
                                className={`page-item page-number ${currentPage === i + 1 ? "active" : ""}`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            </li>
                        ))}

                        {/* Mobile Page Info */}
                        <li className="page-item page-info">
                            <span className="page-link">
                                {currentPage} / {totalPages}
                            </span>
                        </li>

                        {/* Next */}
                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                onClick={() => setCurrentPage(prev => prev + 1)}
                            >
                                Next
                            </button>
                        </li>

                    </ul>
                </nav>
            )}
        </div>
    );
}
