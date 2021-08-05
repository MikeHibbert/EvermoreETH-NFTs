pragma solidity ^0.8.6;
pragma experimental ABIEncoderV2;

contract EvermoreFile {
    struct File{
        string path;
        string hash;
    }

    struct User {
        File[] files;
    }

    mapping(address => User) userStructs;
    address[] userAddresses;
    mapping(address => bool) userAddressesStored;

    function createUser(address user) internal {
        userAddresses.push(user);
        userAddressesStored[user] = true;
    }

    function inUsers(address user) public view returns (bool found) {
        return userAddressesStored[user];
    }

    function getAllUsers() external view returns (address[] memory) {
        return userAddresses;
    }

    function set(string memory file_path, string memory ipfsHash) public {
        File memory file = File({path: file_path, hash: ipfsHash});
        userStructs[msg.sender].files.push(file);

        if(!inUsers(msg.sender)) {
            createUser(msg.sender);
        }
    }

    function getFilesFor(address owner) public view returns (File[] memory files) {
        files = userStructs[owner].files;
    } 

    function getUsers() public view returns (address[] memory) {
        return userAddresses;
    }
}