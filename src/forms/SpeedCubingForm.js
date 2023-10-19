import axios from "axios";
import { React, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import keys from "../keys.json";
import AOS from "aos";
import "aos/dist/aos.css";
import Title from "../components/Title";
import docs from "../assets/eventsAssets/terrainTreader.docx";
import HCaptcha from '@hcaptcha/react-hcaptcha';

const backend = keys.backend;

const SpeedCubingForm = () => {
  useEffect(() => {
    AOS.init();
  }, []);

  const cachedForm = JSON.parse(localStorage.getItem("terrainTreaderForm")) || {
    Team_name: "",
    Leader_name: "",
    Leader_whatsapp: "",
    Leader_branch: "",
    Leader_yog: ""
  };
  const [form, set] = useState(cachedForm);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isSubmitting, setSubmit] = useState(false);

  const handle = (e) => {
    const update = { ...form };
    update[e.target.name] = e.target.value;
    set(update);
    localStorage.setItem("terrainTreaderForm", JSON.stringify(update));
  };

  const [token, setToken] = useState(null);
  const captchaRef = useRef(null);

  const onLoad = () => {
    // this reaches out to the hCaptcha JS API and runs the
    // execute function on it. you can use other functions as
    // documented here:
    // https://docs.hcaptcha.com/configuration#jsapi
    captchaRef.current.execute();
  };

  useEffect(() => {
    if (token) {
      console.log('Captcha verified')
    }
      // console.log(`hCaptcha Token: ${token}`);
  }, [token]);

  const submit = async () => {
    // const recaptchaValue = recaptchaRef.current.getValue();
    // Send the recaptchaValue along with the form data to your server for verification.
    if (!token) {
      alert("Human verification is mandatory");
      return;
    }
    setSubmit(true);
    let condition =
      form.Team_name !== "" &&
      form.Leader_name !== "" &&
      form.Leader_whatsapp !== "" &&
      form.Leader_yog !== "" &&
      form.Leader_branch !== "" &&
      form.Leader_whatsapp.length == 10;

    if (condition) {
      try {
        const res = await axios.post(`/server/register?event=terrainTreader`, form, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        alert(res.data.message);
      } catch (err) {
        console.error(err);
        alert(err.response.data.message);
      }
    } else {
      alert("Please fill all the necessary details correctly");
    }
    setSubmit(false);
  };

  const onVerifyCaptcha = () => {

  }

  return (
    <div
      className="metaportal_fn_mintpage"
      id="registration"
      style={{ position: "relative", zIndex: "0", paddingTop: "5rem" }}
    >
      <Title color={"SPEED"} noncolor={"CUBING"} />
      <div className="container small" style={{ paddingTop: "3rem" }}>
        <div className="metaportal_fn_mintbox">
          <div className="mint_left">
            <div className="mint_title">
              <span>REGISTER NOW</span>
            </div>
            <div className="mint_list">
              <ul>
                <li data-aos="fade-down">
                  <input
                    name="Team_name"
                    id="teamName"
                    type="text"
                    placeholder="Team Name"
                    onChange={(e) => handle(e)}
                    value={form.Team_name}
                  />
                </li>
                <li data-aos="fade-down">
                  <input
                    id="leaderName"
                    type="text"
                    name="Leader_name"
                    placeholder="Leader Name"
                    onChange={(e) => handle(e)}
                    value={form.Leader_name}
                  />
                </li>
                <li data-aos="fade-down">
                  <input
                    id="leaderNumber"
                    type="text"
                    name="Leader_whatsapp"
                    placeholder="Leader Whatsapp Number"
                    onChange={(e) => handle(e)}
                    value={form.Leader_whatsapp}
                  />
                  <span style={{ fontSize: "0.7rem" }}>
                    * Don't include +91 or 0.
                  </span>
                  {form.Leader_whatsapp !== "" &&
                    form.Leader_whatsapp.length !== 10 && (
                      <p style={{ color: "red" }}>
                        Enter a number of 10 digits only.
                      </p>
                    )}
                </li>
                <li data-aos="fade-down">
                  <input
                    name="Leader_branch"
                    id="leaderBranch"
                    type="text"
                    placeholder="Leader Branch"
                    onChange={(e) => handle(e)}
                    value={form.Leader_branch}
                  />
                </li>
                <li data-aos="fade-down">
                  <input
                    name="Leader_yog"
                    id="leaderYog"
                    type="text"
                    placeholder="Leader's year of graduation"
                    onChange={(e) => handle(e)}
                    value={form.Leader_yog}
                  />
                </li>
              </ul>
            </div>
            <HCaptcha
              sitekey={keys.hcaptcha}
              onClick={onLoad}
              onVerify={setToken}
              ref={captchaRef}
            />
            <div className="mint_desc" style={{ paddingTop: "4rem" }}>
              {/* <ReCAPTCHA
                sitekey="6LcIzaMoAAAAAHJK_7w8zc2WlllaZm4asH4POtWI"
                ref={recaptchaRef}
              /> */}
              {!isSubmitting ? (
                <div
                  target="_blank"
                  rel="noreferrer"
                  className="metaportal_fn_button"
                  style={{ cursor: "pointer" }}
                  onClick={submit}
                  disabled={isSubmitting}
                >
                  <span>Submit</span>
                </div>
              ) : (
                <>Submitting...</>
              )}
              <p>* Read the Rules & Regulations before Submitting</p>
            </div>
          </div>
          <div className="mint_right">
            <div className="mright">
              {/* <div data-aos="fade-down" className="mint_time">
                <h4>Terrain Treader</h4>
                <h3 className="metaportal_fn_countdown">
                  Rules and Regulations
                </h3>
              </div>
              <div data-aos="fade-down" className="mint_info">
                <p>
                Round 1 - Participants will be divided into (10)equal groups each of equal people (4) (since 4 cubes ). Volunteers must keep the check of timer and record the time for each participant. Noted times shall be passed to exes. They'll see the timing proof n arrange the data n find out the top 8 fastest people .
                </p>
                <p>
                Round 2 - Participants will be given 4 pyramid cubes nd same criteria will be there for shortlisting for another round. 
                <br />- need a person who knows how to exactly scramble it pattern wise.
                </p>
                <p>
                  3. Each team can have maximum 3 members. (Students from
                  different branches can form a team)
                </p>
                <p>
                  4. The robot must not leave behind any of its parts during the
                  run; else it will result in deduction in points.
                </p>
                <p>
                  5. No any AC/DC power supply will be provided at the sight of
                  play.
                </p>
                <p>
                  6. Unethical behaviour could lead to disqualification.
                  Faculty-coordinators have all the rights to take final
                  decision for any matter during the event.
                </p>
                <p>7. Judge's decision will be considered final.</p>
                <p>8. Certificates will be given to all the participants.</p>
              </div> */}
              {/* <div
                data-aos="fade-down"
                style={{ paddingTop: "2rem" }}
                className="mint_time"
              >
                <h4>PROCEDURES</h4>
                <h3 className="metaportal_fn_countdown">PHASES IN THE EVENT</h3>
              </div>
              <div data-aos="fade-down" className="mint_info">
                <p>
                  1. The competition is based on time, performance and
                  perfection trail system. There will a qualifying round for
                  each team.
                  <br />
                  <br /> 2. The top team from qualifying round makes it to the
                  final round on basis of time trials.
                  <br />
                  <br /> 3. 2 hand touches are allowed without any penalty after
                  that there will be penalty of 7 sec for each hand touch,
                  penalty time will be added further too overall time required
                  by robot for completion of specified round.
                  <br />
                  <br /> 4. If any of the robots starts off before start up
                  call, the counter would be restarted and the machines will get
                  a second chance.
                  <br />
                  <br /> 5. Your robot must be ready when call is made for your
                  team.
                  <br />
                  <br /> 6. Machine must not contain any readymade kits,
                  pneumatic & hydraulic systems, IC engines.
                  <br /> <br /> 7. Decision about your robot will be taken by
                  the organizers.
                </p>
              </div> */}
              <a style={{ textDecoration: "none" }} href={docs}>
                {/* <span className="metaportal_fn_button_4">Download PDF</span> */}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeedCubingForm;