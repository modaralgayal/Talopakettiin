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

  // Blog posts data
  const blogPosts = [
    {
      title: "Talopaketin valinta: Näin löydät parhaan vaihtoehdon",
      excerpt: "Opi valitsemaan oikea talopaketti tarpeisiisi sopivaksi. Käymme läpi tärkeimmät huomioitavat asiat.",
      date: "2024-03-15",
      image: "https://placehold.co/600x400/e2e8f0/1e40af?text=Talopaketti"
    },
    {
      title: "Energiatehokkuus uudessa kodissa",
      excerpt: "Miten energiatehokkuus vaikuttaa talopaketin valintaan? Käymme läpi nykyaikaiset ratkaisut.",
      date: "2024-03-10",
      image: "https://placehold.co/600x400/e2e8f0/1e40af?text=Energia"
    },
    {
      title: "Rahoitusvaihtoehdot talopaketille",
      excerpt: "Tutustu erilaisiin rahoitusvaihtoehtoihin ja löydä sinulle sopivin ratkaisu.",
      date: "2024-03-05",
      image: "https://placehold.co/600x400/e2e8f0/1e40af?text=Rahoitus"
    },
    {
      title: "Sisustussuunnittelu uuteen kotiin",
      excerpt: "Vinkkejä sisustussuunnitteluun ja sisätilojen toteutukseen uudessa kodissa.",
      date: "2024-03-01",
      image: "https://placehold.co/600x400/e2e8f0/1e40af?text=Sisustus"
    },
    {
      title: "Ympäristöystävällinen rakentaminen",
      excerpt: "Miten rakentaa ympäristöystävällisesti? Käymme läpi kestävän kehityksen periaatteet.",
      date: "2024-02-25",
      image: "https://placehold.co/600x400/e2e8f0/1e40af?text=Ympäristö"
    },
    {
      title: "Talopaketin hankintaprosessi",
      excerpt: "Vaihe vaiheelta opas talopaketin hankintaprosessiin ja tärkeimmät huomioitavat asiat.",
      date: "2024-02-20",
      image: "https://placehold.co/600x400/e2e8f0/1e40af?text=Prosessi"
    }
  ];

  // Function to format date to Finnish format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fi-FI');
  };

  // Sort posts by date (newest first) and limit to 6
  const sortedAndLimitedPosts = [...blogPosts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  return (
    <div className="min-h-screen font-['Avenir']">
      {/* Hero + Cards with Slideshow background */}
      <div className="relative w-full flex flex-col justify-center">
        <div className="absolute inset-0 w-full h-full z-0">
          <ImageSlideshow />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/10" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          {/* Hero Content */}
          <div className="text-center mb-75">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
              Löydä unelmiesi talopaketti
            </h1>
            <p className="text-2xl text-white max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-lg">
              Helpoin tapa vertailla talopaketteja ja saada tarjouksia luotettavilta toimittajilta. 
              Täytä yksi hakemus ja anna meidän hoitaa loput.
            </p>
            <Link
              to="/formpage"
              className="inline-flex items-center px-12 py-6 border-2 border-transparent text-xl font-bold rounded-full shadow-xl text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 tracking-wide transform hover:scale-105"
            >
              Aloita hakuprosessi
              <svg className="ml-3 -mr-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <p className="mt-4 text-lg text-white/90">
              Täytä hakemus ja saat tarjouksia luotettavilta talotoimittajilta
            </p>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-blue-500 hover:border-2 cursor-pointer group"
              >
                <div className="mb-4 text-blue-500 group-hover:text-blue-700 transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight group-hover:text-blue-700 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Section with solid background */}
      <div className="bg-blue-50 w-full">
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
                <div key={index} className="relative flex justify-center items-start">
                  <div className="bg-white aspect-square w-full rounded-xl shadow-md transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-blue-500 hover:border-2 cursor-pointer group flex flex-col items-center pt-10 pb-6 px-6">
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg transition-all duration-300 group-hover:bg-blue-700 z-10">
                      {step.number}
                    </div>
                    <h3 className="text-4xl font-semibold text-gray-900 mb-2 mt-6 tracking-tight group-hover:text-blue-700 transition-colors duration-300 text-center">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-2xl text-center">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
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

      {/* Blog Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 tracking-tight">
            Ajankohtaisia artikkeleita
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedAndLimitedPosts.map((post, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="text-sm text-blue-600 mb-2">{formatDate(post.date)}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <button className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
                    Lue lisää →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
