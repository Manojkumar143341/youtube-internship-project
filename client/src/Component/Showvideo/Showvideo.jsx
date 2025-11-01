const handleDownload = async () => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/downloads",
      { videoId: vid._id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", vid.filename);
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    if (error.response?.status === 403) {
      alert(error.response.data.message);
      // optionally redirect to premium page:
      // navigate('/premium');
    } else {
      alert("Download failed. Please try again later.");
    }
  }
};
