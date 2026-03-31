import Navbar from "Components/Navbar";
import Upload from "Components/Upload";
import type { Route } from "./+types/home";
import { ArrowRight, Layers, Clock, ArrowUpRight} from "lucide-react";
import { Button } from "Components/ui/button";
import { useNavigate } from "react-router";
import { useState } from "react";
import { CreateProject } from "lib/puter.action";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<DesignItem[]>([]);

  const handleUploadComplete = async (base64Image: string) => {
    const newId = Date.now().toString();

    const name = `Residence ${newId}`;

    const newItem = {
      id: newId, name, sourceImage: base64Image, 
      renderedImage: undefined,
      timestamp: Date.now()
    }

    const saved = await CreateProject({item: newItem, visibility: 'private'});

    if(!saved) {
      console.error("Failed to create project");
      return false;
    }

    setProjects(prev => [newItem, ...prev]);


    navigate(`/visualizer/${newId}`, 
      {
        state: {
          initialImage: saved.sourceImage,
          initialRendered: saved.renderedImage || null,
          name
        }
      }
    );

    return true;
  }

  return (
     <div className="home">
         <Navbar/>
         <section className="hero">
          <div className="announce">
            <div className="dot">
              <div className="pulse"></div>
            </div>
            <p>Introducing Roomify V2.0</p>
          </div>
          <h1>Build beautiful spaces at the speed of thought with roomify</h1>
          <p className="subtitle">Roomify is a revolutionary interior design platform that uses AI to help you create stunning living spaces. With Roomify, you can design your dream home in minutes, without any prior design experience.</p>
          <div className="actions">
            <a href="#upload" className="cta">
              Start Building <ArrowRight className="icon"/>
            </a>

            <Button variant = "outline" size="lg"
            className="demo">
              Watch Demo
            </Button>
          </div>

          <div id="upload" className="upload-shell">
            <div className="grid-overlay"/>

            <div className="upload-card">
              <div className="upload-head">
                <Layers className="icons"/>
              </div>

              <h3> Upload your floor plan</h3>
              <p>Support JPG, PNG, formats up to 10MB</p>
              <div>

                <Upload onComplete={handleUploadComplete}/>
              </div>
            </div>
          </div>


         </section>

         <section className="projects">
            <div className="section-inner">
              <div className="section-head">
                <div className="copy">
                  <h2>Projects</h2>
                  <p>Your latest work and shared community projects, all in one place.</p>
                </div>
              </div>
              <div className="projects-grid">
                {projects.map(({id, name, renderedImage, sourceImage,
                 timestamp}) => (
                <div className="project-card group">
                  <div className="preview"> 
                    <img src={renderedImage || sourceImage} alt="project" />
                    <div className="badge"> 
                      <span>Community</span>
                    </div>
                  </div>
                  <div className="card-body">
                    <div>
                      <h3>{name}</h3>
                      <div className="meta">
                        <Clock size={12}/>
                        <span>
                          {new Date(timestamp).toLocaleDateString()}
                        </span>
                        <span>By Fanjs</span>
                      </div>
                    </div>
                    <div>
                      <ArrowUpRight size={10}/>
                    </div>
                  </div>
                </div>
                 ))}
              </div>
            </div>           
         </section>
         
     </div>
  ) 
}
