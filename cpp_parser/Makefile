
# List of programs to be made.

PROGS = caffparser


# List of C++ source files.

CPPSRC =  main.cpp ciff.cpp caff.cpp

# List of C source files (if any).

CSRC = 

#******************************************************************************
# End of section.
#******************************************************************************

# Name of the C++ compiler/translator.
# We will use the Cygnus g++ compiler, so be sure to "add cygnus" at your
# athena% prompt. Also remember to "detach gnu" if you have attached it before.
# (You do not have to specify the include paths for the C++ header files; the
# Cygnus g++ compiler is invoked by a script which will take care of this.)

CPP = C:\Users\zsombor\MinGW\bin\g++

# Name of the C compiler.  (See above comments.)

CC = C:\Users\zsombor\MinGW\bin\gcc

# Directory in which to maintain binaries.
# This has been set to the current working directory i.e. the directory from
# which the makefile was invoked.  However, if you run out of disk space, you
# may want to change it to /usr/tmp.

BINDIR = .
#BINDIR = /usr/tmp

# Macro for setting up symbolic links in the event that ${BINDIR} is not the
# current working directory.

SETUPLINKS = @ if (test ${BINDIR} != .) then \
             ln -s ${BINDIR}/$@ $@; \
             else \
             break; \
             fi


# Link time options.

LDFLAGS = 

# Libraries to be linked.

LDLIBS = -lX11 -lm

# Create lists of object files from the source file lists.

CPPOBJ = ${CPPSRC:.C=.o}     
COBJ = ${CSRC:.c=.o}     

#------------------------------------------------------------------------------
#
# Define a list of significant suffixes as well as some suffix rules.
#
#------------------------------------------------------------------------------

.SUFFIXES:          # Delete the default list of significant suffixes.
.SUFFIXES: .o .C .c # Add .o .C .c to the current list of significant suffixes.

# Construct a .o file from a .C file with same name.
# Binaries go in ${BINDIR}.

.C.o:
	@ echo "Building target $@:"
	${CPP} -o ${BINDIR}/$@ -c $<
	${SETUPLINKS}

# Construct a .o file from a .c file with same name.
# Binaries go in ${BINDIR}.

.c.o:
	@ echo "Building target $@:"
	${CC} -o ${BINDIR}/$@ -c $<
	${SETUPLINKS}

# Construct an executable from a .C file with same name.
# Binaries go in ${BINDIR}.

.C:
	@ echo "Building target $@:"
	${CPP} ${LDFLAGS} ${LIBDIRS} -o ${BINDIR}/$@ $< ${LDLIBS}
	${SETUPLINKS}

# Construct an executable from a .c file with same name.
# Binaries go in ${BINDIR}.

.c:
	@ echo "Building target $@:"
	${CC} ${LDFLAGS} ${LIBDIRS} -o ${BINDIR}/$@ $< ${LDLIBS}
	${SETUPLINKS}

#------------------------------------------------------------------------------
#
# Make targets.
#
#------------------------------------------------------------------------------

# Ensure that all programs have been built by making target "all".

all: ${PROGS}
	@ echo "Done!"

# Making following target will remove all the object files and executables
# in your current directory, as well as those in ${BINDIR}.  To perform this
# cleanup operation, type
#		make -f  clean
# where  is the name of this makefile.

clean:
	@ rm -f ${PROGS} *.o
	@ echo "Cleaned up current working directory."
	@ if (test ${BINDIR} != .) then \
	cd ${BINDIR}; rm -f ${PROGS} *.o; \
	echo "Cleaned up ${BINDIR}."; \
	else \
	break; \
	fi

# Build the final executable(s) from the object files.  If the list ${PROGS}
# contains multiple programs, then each program will be assumed to depend on
# all of the object files in the lists ${CPPOBJ} and ${COBJ}.  (To avoid this,
# you could list each of the targets separately with its respective
# dependencies, using a format similar to the one used here.)

${PROGS}: ${CPPOBJ} ${COBJ}
	@ echo "Building target $@:"
	cd ${BINDIR}; \
	${CPP} ${LDFLAGS} ${LIBDIRS} -o $@ ${CPPOBJ} ${COBJ} ${LDLIBS}
	${SETUPLINKS}

#******************************************************************************
# The following section maybe modified to reflect your file dependencies.
#******************************************************************************
main.o: main.cpp
caff.o: caff.cpp caff.hpp
ciff.o: ciff.cpp ciff.hpp
toojpeg.o: toojpeg.hpp

#******************************************************************************
# End of section.
#******************************************************************************
