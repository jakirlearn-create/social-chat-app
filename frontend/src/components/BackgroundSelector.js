import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackgroundSelector.css';
import { toast } from 'react-hot-toast';

function BackgroundSelector({ current, onSelect, onUpload }) {
  const navigate = useNavigate();
  
  const colorPresets = [
    { name: 'Blue Purple', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: 'Pink Red', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { name: 'Ocean', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { name: 'Sunset', value: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
    { name: 'Forest', value: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)' },
    { name: 'Night', value: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)' },
  ];

  const handleColorSelect = (colorValue) => {
    onSelect(colorValue);
    toast.success('Background color applied!');
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        onSelect(dataUrl);
        toast.success('Background image uploaded!');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      toast.error('Upload failed');
    }
  };

  const handleOnlineStore = () => {
    navigate('/background-store');
  };

  return (
    <div className="bg-selector">
      <h3>Background Colors</h3>
      <div className="bg-color-grid">
        {colorPresets.map((preset, idx) => (
          <button
            key={idx}
            className={`bg-color-preset ${current === preset.value ? 'active' : ''}`}
            style={{ background: preset.value }}
            onClick={() => handleColorSelect(preset.value)}
            title={preset.name}
          />
        ))}
      </div>

      <div className="bg-actions">
        <label className="btn-upload">
           Upload from Device
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e.target.files?.[0])}
            style={{ display: 'none' }}
          />
        </label>
        <button className="btn-online" onClick={handleOnlineStore}>
           Background Store
        </button>
      </div>
    </div>
  );
}

export default BackgroundSelector;
