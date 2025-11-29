const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export function uploadFileWithProgress(url, file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && typeof onProgress === 'function') {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const json = JSON.parse(xhr.responseText);
          resolve(json);
        } catch (err) {
          resolve(xhr.responseText);
        }
      } else {
        reject(new Error(xhr.statusText || `Upload failed (${xhr.status})`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error'));

    const form = new FormData();
    form.append('file', file);
    xhr.send(form);
  });
}

export function uploadImage(file, onProgress) {
  return uploadFileWithProgress(`${API_URL}/upload`, file, onProgress);
}

const uploadService = { uploadFileWithProgress, uploadImage };
export default uploadService;
