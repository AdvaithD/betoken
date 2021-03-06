let GroupFund = artifacts.require("GroupFund");
let ControlToken = artifacts.require("ControlToken");
let OraclizeHandler = artifacts.require("OraclizeHandler");

module.exports = function(deployer, network, accounts) {
  let etherDeltaAddress = "0x4e10d1807608994489355d873edb6dc09b151776";
  deployer.deploy([[
    GroupFund,
    etherDeltaAddress, //Ethdelta address
    accounts[0], //developerFeeAccount
    Math.pow(10, 18), //tenToDecimals
    600,//30 * 24 * 3600, //timeOfCycle
    300,//2 * 24 * 3600, //timeOfChangeMaking
    300,//2 * 24 * 3600, //timeOfProposalMaking
    300, //timeOfSellOrderWaiting
    0.01 * Math.pow(10, 18), //minStakeProportion
    20, //maxProposals
    0.01 * Math.pow(10, 18), //commissionRate
    180,//3600 / 20, //orderExpirationTimeInBlocks
    0.01 * Math.pow(10, 18), //oraclizeFeeProportion
    0.01 * Math.pow(10, 18), //developerFeeProportion
    2 //maxProposalsPerMember
  ], [ControlToken]]).then(
    () => {
      return deployer.deploy(OraclizeHandler, ControlToken.address, etherDeltaAddress);
    }
  ).then(
    () => {
      return ControlToken.deployed().then(
        (instance) => {
          instance.transferOwnership(GroupFund.address);
        }
      );
    }
  ).then(
    () => {
      return OraclizeHandler.deployed().then(
        (instance) => {
          instance.transferOwnership(GroupFund.address);
        }
      );
    }
  ).then(
    () => {
      return GroupFund.deployed().then(
        (instance) => {
          instance.initializeSubcontracts(ControlToken.address, OraclizeHandler.address);
        }
      );
    }
  );
};
