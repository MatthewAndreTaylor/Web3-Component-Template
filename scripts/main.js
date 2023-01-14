// Contract interaction
const walletConnect = document.querySelector("#transact");
if (walletConnect)
  walletConnect.addEventListener("click", () => {
    transact();
  });
const contract_address = "0x6B7723753442241cb4fe24854f319E21129D9ACf";
const ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Donate",
    type: "event",
  },
  {
    inputs: [],
    name: "newDonation",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

async function transact() {
  try {
    // Log into web3 wallet
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider
      .send("eth_requestAccounts", [])
      .then(() => {
        $.toast("generic", "Logged in 📝");
      })
      .catch(() => {
        $.toast("error", "Unable to get account");
      });
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contract_address, ABI, signer);
    // The contract method you would like to run
    await contract
      .newDonation({ value: ethers.utils.parseUnits("100000000", "gwei") })
      .then(() => {
        $.toast("success", "Trxn success 😎");
      })
      .catch(() => {
        $.toast("error", "Trxn failed");
      });
  } catch (err) {
    $.toast("error", "Requires web3 enabled browser");
  }
}

// Toasts
$(function () {
  $("[rel='tooltip']").tooltip();
});

// Return custom toast
(function (window, $) {
  "use strict";

  var defaultConfig = {
    type: "",
    autoDismiss: true,
    container: "#toasts",
    autoDismissDelay: 5000,
    transitionDuration: 500,
  };

  $.toast = function (config) {
    var size = arguments.length;
    var isString = typeof config === "string";

    if (isString && size === 1) {
      config = {
        message: config,
      };
    }

    if (isString && size === 2) {
      config = {
        message: arguments[1],
        type: arguments[0],
      };
    }
    return new toast(config);
  };

  var toast = function (config) {
    config = $.extend({}, defaultConfig, config);
    var close = $(window).width() < 850 ? "" : "&times;";

    var toast = $(
      [
        '<div class="toast ' + config.type + '">',
        "<p>" + config.message + "</p>",
        '<div class="close">' + close + "</div>",
        "</div>",
      ].join("")
    );

    toast.find(".close").on("click", function () {
      var toast = $(this).parent();
      toast.removeClass("show");

      setTimeout(function () {
        toast.remove();
      }, config.transitionDuration);
    });

    $(config.container).append(toast);

    setTimeout(function () {
      toast.addClass("show");
    }, config.transitionDuration);

    if (config.autoDismiss) {
      setTimeout(function () {
        toast.find(".close").click();
      }, config.autoDismissDelay);
    }
    return this;
  };
})(window, jQuery);
