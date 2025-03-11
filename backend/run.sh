docker network create hackathon_twitter_like || true
if ! docker run -d --rm --name db-container --network hackathon_twitter_like --network-alias db-container mongo; then
    echo "Error: Failed to start MongoDB container"
    exit 1
fi
docker build -t backend-container .
docker run -it --rm -p 5201:3000 --name express-app --network hackathon_twitter_like --network-alias backend --mount type=bind,source="$(pwd)"/,target=/app backend-container