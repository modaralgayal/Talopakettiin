import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaClipboardList, FaHandshake, FaClock } from "react-icons/fa";
import { ImageSlideshow } from "../components/ImageSlideshow";

export const Homepage = () => {
  const features = [
    {
      icon: <FaHome className="w-8 h-8 text-blue-500" />,
      title: "Unelmakotisi suunnittelu",
      description: "Määrittele toiveesi ja vaatimuksesi unelmakodillesi - autamme sinua löytämään täydellisen talopaketin."
    },
    {
      icon: <FaClipboardList className="w-8 h-8 text-blue-500" />,
      title: "Helppo hakuprosessi",
      description: "Täytä yksi hakemus ja saat tarjouksia useilta luotettavilta talotoimittajilta."
    },
    {
      icon: <FaHandshake className="w-8 h-8 text-blue-500" />,
      title: "Luotettavat kumppanit",
      description: "Verkostoomme kuuluu vain tarkasti valittuja, luotettavia talotoimittajia."
    },
    {
      icon: <FaClock className="w-8 h-8 text-blue-500" />,
      title: "Säästä aikaa ja vaivaa",
      description: "Ei tarvetta ottaa yhteyttä jokaiseen toimittajaan erikseen - me hoidamme sen puolestasi."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 font-['Avenir']">
      {/* Hero Section with Slideshow */}
      <div className="relative">
        <ImageSlideshow />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
              Löydä unelmiesi talopaketti
            </h1>
            <p className="text-xl text-white max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-lg">
              Helpoin tapa vertailla talopaketteja ja saada tarjouksia luotettavilta toimittajilta. 
              Täytä yksi hakemus ja anna meidän hoitaa loput.
            </p>
            <Link
              to="/formpage"
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full shadow-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 tracking-wide"
            >
              Aloita hakuprosessi
              <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Process Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 tracking-tight">
          Näin prosessi toimii
        </h2>
        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-blue-200 -translate-y-1/2 hidden lg:block" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                number: "1",
                title: "Täytä hakemus",
                description: "Kerro meille toiveistasi ja vaatimuksistasi uuden kotisi suhteen."
              },
              {
                number: "2",
                title: "Saat tarjouksia",
                description: "Talotoimittajat tutustuvat hakemukseesi ja tekevät sinulle tarjouksia."
              },
              {
                number: "3",
                title: "Valitse paras",
                description: "Vertaile tarjouksia ja valitse sinulle sopivin vaihtoehto."
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 tracking-tight">
            Valmis aloittamaan unelmakotisi suunnittelun?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Täytä hakemus nyt ja ota ensimmäinen askel kohti uutta kotiasi.
          </p>
          <Link
            to="/formpage"
            className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-full text-white hover:bg-white hover:text-blue-600 transition-colors duration-200 tracking-wide"
          >
            Täytä hakemus
            <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};
