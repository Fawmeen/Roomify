import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import puter from '@heyputer/puter.js';

const Visualizer = () => {
    const location = useLocation();
    const { id } = useParams();
    const [data, setData] = useState<any>(location.state || {});

    useEffect(() => {
        if (!data.initialImage && !data.sourceImage && id) {
            puter.kv.get(`project_${id}`).then((fetched: any) => {
                if (fetched) {
                    setData((prev: any) => ({ ...fetched, ...prev }));
                }
            }).catch(console.error);
        }
    }, [id]);

    const name = data.name || 'untitled project';
    const image = data.initialImage || data.sourceImage;

  return (
     <section>
        <h1> {name}</h1>

        <div>
            {image && (
                <div className="image-container">
                    <h2>Source Image</h2>
                    <img src={image} alt="source"/>
                </div>
            )}
        </div>
     </section>
  )
}

export default Visualizer