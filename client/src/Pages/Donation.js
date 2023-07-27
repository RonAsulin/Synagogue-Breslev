import React from 'react';
import emailjs from 'emailjs-com';
import { Container, Form, FormControl, FormGroup, Col, Row, Button } from 'react-bootstrap';
import forest from '../pics/forest.png';
import '../css/btnStile.css';
import '../css/Main.css';

function Donation() {
  function sendEmail(e) {
    e.preventDefault();

    emailjs
      .sendForm('service_e12adbp', 'template_2wy7hfs', e.target, 'WERUl7B0yILtOGqbG')
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));

    e.target.reset();
  }

  return (
    <div className="main-container">
      <div className="background-container">
        <img src={forest} alt="forest" className="background-image" />
      </div>
      <div className="content">
        <Container className="mt-4 text-right">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <div className="tracking-in-expand-fwd-top">
              <h1 className="page-title">תרומה</h1>
            </div>
            <section className="relative justify-center items-center flex text-xl">
              <div className="relative items-center justify-center flex py-10 font-extrabold ">
                <h2
                  className="text-4xl text-center myfont  font-extrabold "
                  style={{
                    color: 'black',
                    fontWeight: 600,
                     textShadow: '0 0 2px #fff, 0 0 2px #fff, 0 0 2px #fff, 0 0 2px #fff'
                  }}
                >
                  עַל־יְדֵי צְדָקָה שֶׁנּוֹתֵן לְהַתַּלְמִיד חָכָם, עַל־יְדֵי זֶה נִצּוֹל מִדְּבָרִים בְּטֵלִים וּלְשׁוֹן הָרָע וְגַאֲוָה וְתוֹלְדוֹתֵיהֶן. גַּם עַל־יְדֵי צְדָקָה נִצּוֹלִין מֵעֲנִיּוּת וְזֹאת זוֹכִין לַעֲשִׁירוּת: (לק"א סי' ד' אות ח')
                </h2>
                <hr className="mb-1" />
              </div>
            </section>
          </div>

          <Row className=" m-5">
            <Col>
              <div className="grow-0 shrink-0 basis-auto mb-12 md:mb-0 w-full md:w-6/12 px-3 lg:px-6">
                <Form onSubmit={sendEmail}>
                  <FormGroup className="mb-2">
                    <FormControl
                      type="text"
                      style={{ textAlign: 'right' }}
                      className="form-control block w-full px-3 py-1.5 text-base font-bold text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-right"
                      placeholder="שם מלא"
                      name="name"
                    />
                  </FormGroup>

                  <FormGroup className="mb-2">
                    <FormControl
                      type="email"
                      style={{ textAlign: 'right' }}
                      className="form-control block w-full px-3 py-1.5 text-base font-bold text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-right"
                      placeholder="כתובת-דואר"
                      name="email"
                    />
                  </FormGroup>
                  <FormGroup className="mb-2">
                    <FormControl
                      type="phone"
                      style={{ textAlign: 'right' }}
                      className="form-control block w-full px-3 py-1.5 text-base font-bold text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-right"
                      placeholder="פאלפון"
                      name="phone"
                    />
                  </FormGroup>

                  <FormGroup className="mb-2">
                    <FormControl
                      type="text"
                      style={{ textAlign: 'right' }}
                      className="form-control block w-full px-3 py-1.5 text-base font-bold text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-right"
                      placeholder="נושא"
                      name="subject"
                    />
                  </FormGroup>

                  <FormGroup className="mb-2">
                    <FormControl
                      as="textarea"
                      style={{ textAlign: 'right' }}
                      className="form-control block w-full px-3 py-1.5 text-base font-bold text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-right"
                      rows="3"
                      placeholder="הודעה"
                      name="message"
                    />
                  </FormGroup>
                  <Button type="submit" className="btn-custom">
                    שלח
                  </Button>
                </Form>
              </div>
            </Col>

            <Col className="text-right">
              <div
                className="grow-0 shrink-0 basis-auto mb-6 md:mb-0 w-full md:w-6/12 px-3 lg:px-6"
                style={{ textAlign: 'right', fontSize: '18px', fontWeight: 'bolder' }}
              >
                <h2
                  className="text-4xl font-extrabold mb-6 "
                  style={{ textShadow: '0 0 2px #fff, 0 0 2px #fff, 0 0 2px #fff, 0 0 2px #fff' }}
                >
                  תרומות לבית המדרש
                </h2>
                <hr className="mb-1" />
                <p
                  className="text-black-500 text-2xl font-extrabold mb-6"
                  style={{ textShadow: '0 0 2px #fff, 0 0 2px #fff, 0 0 2px #fff, 0 0 2px #fff' }}
                >
                  שלום
                </p>
                <p
                  className="text-white text-2xl font-extrabold mb-2"
                  style={{ textShadow: '0 0 2px #000, 0 0 2px #000, 0 0 2px #000, 0 0 2px #000' }}
                >
                  ניתן לתרום גם באמצעות ביט: 054-2187218
                </p>
                <p
                  className="text-white text-2xl font-extrabold mb-2"
                  style={{ textShadow: '0 0 2px #000, 0 0 2px #000, 0 0 2px #000, 0 0 2px #000' }}
                >
                  לפרטים נוספים ניתן ליצור קשר עם שחר: 054-2187218
                </p>
                <p
                  className="text-white text-2xl font-extrabold mb-2"
                  style={{ textShadow: '0 0 2px #000, 0 0 2px #000, 0 0 2px #000, 0 0 2px #000' }}
                >
                  : ניתן לשלוח דוא"ל לכתובת
                </p>
                <p
                  className="text-white text-2xl font-extrabold mb-2"
                  style={{ textShadow: '0 0 2px #000, 0 0 2px #000, 0 0 2px #000, 0 0 2px #000' }}
                >
                  breslevDimona@gmail.com
                </p>
                <p
                  className="text-white text-2xl font-extrabold mb-2"
                  style={{ textShadow: '0 0 2px #000, 0 0 2px #000, 0 0 2px #000, 0 0 2px #000' }}
                >
                  נעדכן בפרטים נוספים
                </p>
              </div>
            </Col>
          </Row>
          <div className="flex justify-end" style={{ marginTop: '-50px' }}></div>
        </Container>
      </div>
    </div>
  );
}

export default Donation;
