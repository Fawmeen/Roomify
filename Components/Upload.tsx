import React, { useState } from 'react';
import { useOutletContext } from 'react-router';
import { UploadIcon, ImageIcon, CheckCircle2 } from 'lucide-react';
import { PROGRESS_INTERVAL_MS, PROGRESS_INCREMENT, REDIRECT_DELAY_MS } from '../lib/Constant';

interface UploadProps {
    onComplete?: (base64: string) => void;
}

const Upload: React.FC<UploadProps> = ({ onComplete }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const {isSignedIn} = useOutletContext<AuthContext>();

    const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

    const processFile = (selectedFile: File) => {
        if (!isSignedIn) return;

        setError(null);

        if (!ALLOWED_TYPES.includes(selectedFile.type)) {
            setError("Please upload a valid JPG or PNG image.");
            return;
        }

        if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
            setError("File size exceeds the 10 MB limit.");
            return;
        }

        setFile(selectedFile);
        setProgress(0);

        const reader = new FileReader();
        let interval: ReturnType<typeof setInterval>;

        const handleReadError = () => {
            if (interval) clearInterval(interval);
            setFile(null);
            setProgress(0);
            setError("Failed to read file. Please try again.");
        };

        reader.onload = (e) => {
            const base64 = e.target?.result as string;
            
            interval = setInterval(() => {
                setProgress((prevProgress) => {
                    const nextProgress = prevProgress + PROGRESS_INCREMENT;
                    if (nextProgress >= 100) {
                        clearInterval(interval);
                        setTimeout(() => {
                            if (onComplete) onComplete(base64);
                        }, REDIRECT_DELAY_MS);
                        return 100;
                    }
                    return nextProgress;
                });
            }, PROGRESS_INTERVAL_MS);
        };

        reader.onerror = handleReadError;
        reader.onabort = handleReadError;

        reader.readAsDataURL(selectedFile);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (isSignedIn) setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (isSignedIn) setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!isSignedIn) return;
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isSignedIn) return;
        if (e.target.files && e.target.files.length > 0) {
            processFile(e.target.files[0]);
        }
    };

    return (
        <div className="upload">
            {!file ? (
                <div 
                    className={`dropzone ${isDragging ? 'is-dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                > 
                    <input type="file" 
                    className="drop-input" 
                    accept=".jpg,.jpeg,.png" 
                    disabled={!isSignedIn}
                    onChange={handleChange}/>

                    <div className="drop-content">
                        <div className="drop-icon">
                            <UploadIcon size={20}/>
                        </div>
                        <p>
                            {isSignedIn? (
                                "click to upload or just drag and drop"
                            ) : (
                                "Sign in or sign up with PUTER to upload"
                            )}
                        </p>
                        <p className="help">Maximum file size is 10 MB.</p>
                        {error && (
                            <p className="error-text" style={{ color: 'var(--red-500, red)', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                                {error}
                            </p>
                        )}
                    </div>
                </div>
                
            ) : (
                <div className="upload-status">
                    <div className="status-content">
                        <div className="status-icon">
                            {progress === 100 ? (
                                <CheckCircle2 className="check"/>
                            ) : (
                                <ImageIcon className="image"/>
                            )}
                        </div>
                        <h3>{file.name}</h3>
                        <div className='progress'>
                            <div className="bar" style={{width:`${progress}%`}}></div>
                            <p className="status-text">
                                {progress<100 ? 'Analyzing Floor plan...': 'Redirecting...'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Upload;