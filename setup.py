#!/usr/bin/env python
import setuptools
import os


def get_version(path):
    with open(path, "r") as f:
        _, version = f.read().strip().split("=")
        version = version.strip().strip('"')
    return version


with open("README.md", "r") as fh:
    long_description = fh.read()


installations = ['numpy', 'pandas', 'streamlit >= 0.83']


setuptools.setup(
    name="st-material-table",
    version=get_version(os.path.join(
        ".",
        "st_material_table",
        "_version.py",
    )),
    author="Brian L. Chen",
    author_email="brian.lxchen@gmail.com",
    description="Streamlit Custom Components in React",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/icheft/st-material-table",
    packages=setuptools.find_packages(),
    classifiers=["Programming Language :: Python :: 3",
                 "License :: OSI Approved :: MIT License",
                 "Operating System :: OS Independent", ],
    python_requires='>=3.6',
    install_requires=installations,
    include_package_data=True,
)
