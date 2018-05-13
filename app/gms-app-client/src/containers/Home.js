import React, { Component } from "react";
import "./Home.css";
import image from './Home.png';

export default class Home extends Component {
  render() {
    return (
      <div className="Home">
        <img src={image} alt={"image"}/>
        <div className="lander">
          <h1>Garden Management System</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse mollis malesuada congue. Curabitur dictum enim ut placerat euismod. Sed eu venenatis ex, et feugiat urna. In ut blandit tellus. Praesent id eleifend est. Nunc viverra risus a sollicitudin auctor. Sed convallis dui erat. Praesent eget ligula laoreet, convallis erat nec, mattis leo. Nunc in nisi congue, commodo tortor eget, sagittis justo. Mauris mollis magna in justo mattis, eu blandit lacus suscipit. Quisque ut elementum dui. Pellentesque dignissim mi est, quis volutpat odio mollis vitae.
          </p>
          < p >
            Praesent rhoncus ligula nec nulla placerat, sit amet euismod mauris blandit.Donec felis sapien, pretium et venenatis et, porttitor sed libero.Morbi maximus mollis egestas.Nullam aliquet tortor eu imperdiet interdum.Fusce elementum urna eget urna porta vulputate.Aenean eget libero eget urna consectetur faucibus nec vitae mauris.Morbi sed dolor ac nulla viverra euismod sed sed justo.Nulla in auctor orci.Nulla facilisi.Pellentesque placerat nulla vitae iaculis tristique.Maecenas at ipsum vehicula, malesuada velit id, pretium dolor.Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
          </p>
        </div>
      </div>
    );
  }
}
