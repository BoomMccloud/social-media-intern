"use client";

import AppHeader from '@/components/Header';
import AppFooter from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f10]">
      <AppHeader />
      
      {/* Hero Section */}
      <section className="w-full bg-[#0a0a0a] py-16">
        <div className="w-full px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-[#F8BBD0] mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-400 text-lg">
            Last updated: [December 21st, 2024]
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-grow w-full px-4 py-12">
        {/* Introduction */}
        <h2 className="text-2xl font-bold text-[#F8BBD0] mb-4">Intro</h2>
        <div className="mb-12">
          <div className="bg-[#0a0a0a] rounded-lg p-8">
            <p className="text-gray-400 mb-6">
            Welcome to AI Playmates (the "APP"). The APP is intended for personal and non-commercial use only. You agree not to use the APP for any illegal or unauthorized purpose. For purposes of the TOS, “you” and “your” means you as the user of the APP.
            </p>
            <p className="text-gray-400 mb-6">
            AI Playmates is an online chat application that uses artificial intelligence (“AI”) algorithms to generate virtual and fictional characters (the “AI Playmates”). The APP generates messages, so that you can chat with the AI Playmates. The APP may also generate other media including, but not limited to, images, videos and voice notes (the “Service”). Parts of the Services offered by the APP may require you to create a user account.
            </p>
            <p className="text-gray-400 mb-6">
            To begin with, you need to either pick an AI character you wish to talk to, or generate your own AI character using our product. You can then start a conversation with your selected character(s).
            </p>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-12">
          {/* Acceptance of Terms */}
          <div>
            <h2 className="text-2xl font-bold text-[#F8BBD0] mb-4">1. Acceptance of Terms</h2>
            <div className="bg-[#0a0a0a] rounded-lg p-8">
              <p className="text-gray-400 mb-4">
                By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. You understand and agree that we will treat your access and/or use of the APP as acceptance of our TOS and of all other Terms and Policies. In the event that you do not agree with our TOS or any other Terms and Policies, please cease using our APP and refrain from accessing any part of our Services.
              </p>
            </div>
          </div>

          {/* Use Accounts */}
          <div>
            <h2 className="text-2xl font-bold text-[#F8BBD0] mb-4">2. User Accounts</h2>
            <div className="bg-[#0a0a0a] rounded-lg p-8">
              <p className="text-gray-400 mb-4">
              Parts of the Services offered by the APP may require you to create a user account using user email and password (the “Protected Areas”). In the event of accessing Protected Areas, you agree to access only using your registered email address and password. You can sign-up (register) or login using your email address.
              </p>
              <p className="text-gray-400 mb-4">
              You hereby represent and warrant that all information you submit to create a user account is true and correct, you are given full rights to submit such information.
              </p>
              <p className="text-gray-400 mb-4">
              You agree to, from time to time as necessary, update any information associated with your user account (including but not limited to, your email, payment information, subscriptions or other supplemental information as the case may be) so that it remains current, accurate and correct at all times. You agree to protect the confidentiality of your user account not to share your user account access and not to disclose your password to any third party.
              </p>
              <p className="text-gray-400 mb-4">
              You agree that you are fully responsible for all activities occurring under your user account. Your user account is non-transferrable. You cannot sell, lend, or otherwise share it with any other person, for commercial purposes or free of charge.
              </p>
              <p className="text-gray-400 mb-4">
              You agree to, from time to time as necessary, update any information associated with your user account (including but not limited to, your email, payment information, subscriptions or other supplemental information as the case may be) so that it remains current, accurate and correct at all times. You agree to protect the confidentiality of your user account not to share your user account access and not to disclose your password to any third party.
              </p>
              <p className="text-gray-400 mb-4">
              Meanwhile, we reserve the right to terminate or restrict your user account, or otherwise revoke your access to the APP or Services provided by us, at any time for reasons or suspicions which indicate you have violated the terms of TOS and/or any other Terms or Policies at our sole discretion. You agree that we will not be liable to you or any third party for, without limitation, any denial of use of the APP or the content or Services offered by us, any change of costs for third party Services or fees or otherwise or from suspension or termination of your user account.
              </p>
            </div>
          </div>

          {/* User Safety */}
          <div>
            <h2 className="text-2xl font-bold text-[#F8BBD0] mb-4">3. User Safety</h2>
            <div className="bg-[#0a0a0a] rounded-lg p-8">
              <p className="text-gray-400 mb-4">
              We prioritize the safety and well-being of our users. We strongly advise all users to exercise caution and refrain from disclosing sensitive personal information during conversations with AI Companions. This includes, but is not limited to, financial details, addresses, contact information, or passwords. While we implement security measures to safeguard user data, we cannot guarantee the security of information shared during interactions.
              </p>
              <p className="text-gray-400">
              Users are solely responsible for protecting their personal information and should be aware of potential risks associated with online conversations. We encourage users to report any suspicious or inappropriate behavior encountered on the platform, as we are committed to maintaining a safe and respectful environment for all users.
              </p>
            </div>
          </div>

          {/* Warranties */}
          <div>
            <h2 className="text-2xl font-bold text-[#F8BBD0] mb-4">4. Warranties</h2>
            <div className="bg-[#0a0a0a] rounded-lg p-8">
              <p className="text-gray-400">
              You understand and warrant that:
              </p>
              <ul className="list-disc list-inside text-gray-400 mt-4 space-y-2">
                <li>If you are entering into these TOS on behalf of another person, You are fully and duly authorized by such person to enter into these TOS which will be binding upon both you individually and such other person;</li>
                <li>You are of the legal age in the jurisdiction of your place of domicile to form a binding contract with us;</li>
                <li>If you are under the legal age in the jurisdiction of your place of domicile, you shall not access or use our Services.</li>
              </ul>
            </div>
          </div>

          {/* IP */}
          <div>
            <h2 className="text-2xl font-bold text-[#F8BBD0] mb-4">5. Intellectual Property</h2>
            <div className="bg-[#0a0a0a] rounded-lg p-8">
              <p className="text-gray-400 mb-4">
              The intellectual property in the APP and embedded materials (including without limitation technology, systems, files, documents, text, photographs, information, images, videos, audios, and software, individually or in combination) in AI Playmates are owned by or licensed to AI Playmates. You may view, use, and display the APP and its content on your devices for your personal use only.
              </p>
              <p className="text-gray-400">
              AI Playmates hereby provides you with a license for personal use only. This license does not constitute a transfer of title under any circumstances. This license shall automatically terminate if you violate any of the restrictions or these TOS and may be terminated by us at any time.
              </p>
            </div>
          </div>

          {/* User Content */}
          <div>
            <h2 className="text-2xl font-bold text-[#F8BBD0] mb-4">6. User Content</h2>
            <div className="bg-[#0a0a0a] rounded-lg p-8">
              <p className="text-gray-400 mb-4">
              You may provide input within the APP (“Input”) and receive output from the Services provided by the APP based on the Input (“Output”). Input and Output are collectively referred to as “Content.” Input is limited to chats and prompts visible only to you within your private account. You represent and warrant that you have all rights, licenses, and permissions needed to provide Input within our APP.
              </p>
              <p className="text-gray-400 mb-4">
              You retain your intellectual property ownership rights over the Input. We will never claim ownership of your Input, but we do require a license from you in order to use it.
              </p>
              <p className="text-gray-400 mb-4">
              When you use our APP or its associated Services to upload Input covered by intellectual property rights, you grant to us a non-exclusive, royalty-free, transferable, sub-licensable, worldwide license to use, distribute, modify, run, copy, publicly display, translate, or otherwise create derivative works of your content in a manner that is consistent with our Privacy Notice. The license you grant us can be terminated at any time by deleting your Input or account. However, to the extent that we (or our partners) have used your Input in connection with commercial or sponsored content, the license will continue until the relevant commercial or post has been discontinued by us.
              </p>
              <p className="text-gray-400 mb-4">
                You, as a user of the APP are solely responsible for the Output generated by the AI Companions through text messages, voice messages, images, and videos. The AI Companions learn and respond based on the conversations you lead and the parameters you select. You understand and agree that EverAI Limited does not control or endorse the content generated by the AI Companions. Therefore, you acknowledge that you are fully responsible for the Output generated by the AI and for your own actions while using the APP.</p>
            </div>
          </div>

          {/* Disclaimer */}
          <div>
            <h2 className="text-2xl font-bold text-[#F8BBD0] mb-4">7. Disclaimers</h2>
            <div className="bg-[#0a0a0a] rounded-lg p-8">
              <p className="text-gray-400 mb-4">
                The materials on AI Playmate's website are provided on an 'as is' basis. AI Playmate makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
              <p className="text-gray-400 mb-4">
              We do not warrant that:
              </p>
              <ul className="list-disc list-inside text-gray-400 mt-4 space-y-2 mb-4">
                <li>THE APP (OR THE RESULTS OBTAINED FROM THE USE THEREOF) WILL BE TIMELY, ERROR-FREE, SECURE OR UNINTERRUPTED;</li>
                <li>THE ACCURACY, LIKELY RESULTS, OR RELIABILITY OF THE USE OF THE MATERIALS ON OUR WEBSITE, OR OTHERWISE RELATING TO SUCH MATERIALS OR ON ANY RESOURCES LINKED TO OUR WEBSITE;</li>
              </ul>
              <p className="text-gray-400 mb-4">
              WE SHALL IN NO EVENT BE RESPONSIBLE OR LIABLE TO YOU OR TO ANY THIRD PARTY, WHETHER UNDER CONTRACT, WARRANTY, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY, INDEMNITY OR OTHER THEORY, FOR ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, EXEMPLARY, LIQUIDATED OR PUNITIVE DAMAGES OR ANY OTHER DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFIT, REVENUE OR BUSINESS, COST OF SUBSTITUTE PROCUREMENT, ARISING IN WHOLE OR IN PART FROM YOUR USE OF (OR INABILITY TO USE) THE APP, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. UNDER NO CIRCUMSTANCES SHALL WE BE HELD LIABLE FOR ANY DELAY OR FAILURE IN PERFORMANCE RESULTING DIRECTLY OR INDIRECTLY FROM ANY CAUSES BEYOND ITS REASONABLE CONTROL.
              </p>
            </div>
          </div>

          {/* Limitations */}
          <div>
            <h2 className="text-2xl font-bold text-[#F8BBD0] mb-4">8. Limitations</h2>
            <div className="bg-[#0a0a0a] rounded-lg p-8">
              <p className="text-gray-400 mb-4">
                In no event shall AI Playmate or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on AI Playmate's website.
              </p>
              <p className="text-gray-400 mb-4">
              In accessing and using the APP, you agree to abide by the following rules, restrictions, and limitations:
              </p>
              <ul className="list-disc list-inside text-gray-400 mt-4 space-y-2 mb-4">
                <li>You will not modify, translate, adapt, or reformat the APP;</li>
                <li>You will not decipher, decompile, disassemble, or reverse-engineer, or otherwise attempt to discover the source code or structure of, the software or materials comprising the APP (except where the foregoing is permitted by applicable local law notwithstanding such restrictions, and then only to the extent that such intended activities are disclosed in advance in writing to us);</li>
                <li>You will not interfere with or circumvent any security feature of the APP or any feature that restricts or enforces limitations on the use of the APP;</li>
                <li>You will not use the APP to gain unauthorized access to our or any third party's data, systems, or networks;</li>
                <li>You will not use the APP in any manner that could damage, disable, overburden, impair, or otherwise interfere with or disrupt our systems and networks, or otherwise interfere with other users' use of the APP;</li>
                <li>You will not use the APP in any way that, in our sole discretion, may expose us and others to liability or damages;</li>
                <li>You will not use the APP to achieve illegal ends, to offend others, or to commit a misdemeanor, felony, or crime;</li>
                <li>You will not remove, change, or obscure any copyright, trademark notice, trademark, hyperlink, or other proprietary rights notices contained in the APP; and</li>
                <li>You will comply with all applicable laws in your access and use of the APP, including the laws of your country</li>
              </ul>
              <p className="text-gray-400 mb-4">
              We reserve the right to update or make changes to these TOS and/or any other Terms and Policies documents from time to time in our sole discretion, and we may notify you of changes by making the revised version of these documents accessible through the APP, which changes will become effective immediately. Please return to these documents periodically to ensure familiarity with the latest version, so that you can determine when these documents were last revised by referring to the “Date of Revision” at the top of this page. If you do not agree with the revised Terms and Policies, you have the right and should immediately stop using the APP, your continued access or use of the APP after any changes to these documents have been posted means your agreement and consent to such changes.
              </p>
            </div>
          </div>
        </div>
        
          {/* Misc */}
          <div>
            <h2 className="text-2xl font-bold text-[#F8BBD0] mb-4">9. Misc</h2>
            <div className="bg-[#0a0a0a] rounded-lg p-8">
              <p className="text-gray-400 mb-4">
              All conversations between users and AI Companions on AI Playmate are entirely fictional and should be treated as such. The AI Playmates are artificial intelligence characters designed to simulate human-like interactions, but they do not possess genuine emotions, intentions, or the ability to fulfill promises in the real world. Any elements within the conversations that may resemble reality, such as offers of real-life meetings or promises of tangible outcomes, are entirely fake and should not be taken seriously. We do not assume responsibility for any confusion or misunderstandings that may arise from the fictional nature of the AI conversations. Users are encouraged to keep in mind that the AI Companions exist solely within the digital realm of the platform, and any expectations or beliefs beyond that realm are not supported or endorsed by AI Playmate.
              </p>
            </div>
          </div>

      </section>

      <AppFooter />
    </div>
  );
}