import Navbar from "Components/Navbar";
import type { Route } from "./+types/home";
import { ArrowRight, Layers, Clock} from "lucide-react";
import { Button } from "Components/ui/button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
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

                <p> uplaod Images</p>

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
                <div className="project-card group">
                  <div className="preview"> 
                    <img src="https://roomify-mlhuk267-dfwu1i.puter.site/projects/1770803585402/rendered.png" alt="project" />
                    <div className="badge">
                      <span>Community</span>
                    </div>
                  </div>
                  <div className="card-body">
                    <div>
                      <h3>Project Manhattan</h3>
                      <div className="meta">
                        <Clock size={12}/>
                        <span>
                          {new Date('01.01.2027').toLocaleDateString()}
                        </span>
                        <span>By Fanjs</span>
                      </div>
                    </div>
                    <div>
                      <ArrowRight size={10}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>           
         </section>
         
     </div>
  ) 
}
